/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';

import {
  Content,
  Header,
  HeaderTabs,
  Page,
  Progress,
  useApi,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

import { useAsync } from 'react-use';

import { OverviewContent } from './OverviewContent';
import { OwnedContent } from './OwnedContent';

export const TechDocsHome = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities();
    return response.items.filter(entity => {
      return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    });
  });

  if (loading) {
    return (
      <Page themeId="documentation">
        <Header
          title="Documentation"
          subtitle="Documentation available in Backstage"
        />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="documentation">
        <Header
          title="Documentation"
          subtitle="Documentation available in Backstage"
        />
        <Content>
          <p>{error.message}</p>
        </Content>
      </Page>
    );
  }
  const tabs = [{ label: 'Overview' }, { label: 'Owned Documents' }];

  return (
    <Page themeId="documentation">
      <Header
        title="Documentation"
        subtitle="Documentation available in Backstage"
      />
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabs.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />
      {selectedTab === 0 ? (
        <OverviewContent value={value} />
      ) : (
        <OwnedContent value={value} />
      )}
    </Page>
  );
};
